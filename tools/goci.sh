#!/bin/bash

# Taken from https://github.com/grandcolline/golang-github-actions/blob/master/entrypoint.sh
# and modified

set -e

# Prerequisites
echo "Installing tools..."
go get -u \
		github.com/kisielk/errcheck \
		golang.org/x/tools/cmd/goimports \
		golang.org/x/lint/golint \
		github.com/securego/gosec/cmd/gosec \
		golang.org/x/tools/go/analysis/passes/shadow/cmd/shadow \
		honnef.co/go/tools/cmd/staticcheck
echo "Tools installed."

# ------------------------
#  Environments
# ------------------------
WORKING_DIR=$1
SEND_COMMNET=true
FLAGS=$2
IGNORE_DEFER_ERR=$3

COMMENT=""
SUCCESS=0


# ------------------------
#  Functions
# ------------------------

# mod_download is getting go modules using go.mod.
mod_download() {
	if [ ! -e go.mod ]; then go mod init; fi
	go mod download
	if [ $? -ne 0 ]; then exit 1; fi
}

# check_errcheck is excute "errcheck" and generate ${COMMENT} and ${SUCCESS}
check_errcheck() {
	if [ "${IGNORE_DEFER_ERR}" = "true" ]; then
		IGNORE_COMMAND="| grep -v defer"
	fi

	set +e
	OUTPUT=$(sh -c "errcheck ${FLAGS} ./... ${IGNORE_COMMAND} $*" 2>&1)
	test -z "${OUTPUT}"
	SUCCESS=$?

	set -e
	if [ ${SUCCESS} -eq 0 ]; then
		return
	fi

	if [ "${SEND_COMMNET}" = "true" ]; then
		COMMENT="## ⚠ errcheck Failed
\`\`\`
${OUTPUT}
\`\`\`
"
	fi
}

clean_pkgs () {
  <&0 grep -vF 'protocol/pb/main.pb.go' |
  grep -vF 'statik/statik.go' || true
}

# check_fmt is excute "go fmt" and generate ${COMMENT} and ${SUCCESS}
check_fmt() {
  echo "Running gofmt"
	set +e
  # Ignore generated protocol buffers code
	UNFMT_FILES=$(sh -c "gofmt -l -s ." 2>&1 | clean_pkgs)
	test -z "${UNFMT_FILES}"
	SUCCESS=$?

	set -e
	if [ ${SUCCESS} -eq 0 ]; then
		return
	fi

	if [ "${SEND_COMMNET}" = "true" ]; then
		FMT_OUTPUT=""
		for file in ${UNFMT_FILES}; do
			FILE_DIFF=$(gofmt -d -e "${file}" | sed -n '/@@.*/,//{/@@.*/d;p}')
			FMT_OUTPUT="${FMT_OUTPUT}
<details><summary><code>${file}</code></summary>

\`\`\`diff
${FILE_DIFF}
\`\`\`
</details>
"
		done
		COMMENT="## ⚠ gofmt Failed
${FMT_OUTPUT}
"
	fi
}

# check_imports is excute go imports and generate ${COMMENT} and ${SUCCESS}
check_imports() {
	set +e
	UNFMT_FILES=$(sh -c "goimports -l . $*" 2>&1 | clean_pkgs)
	test -z "${UNFMT_FILES}"
	SUCCESS=$?

	set -e
	if [ ${SUCCESS} -eq 0 ]; then
		return
	fi

	if [ "${SEND_COMMNET}" = "true" ]; then
		FMT_OUTPUT=""
		for file in ${UNFMT_FILES}; do
			FILE_DIFF=$(goimports -d -e "${file}" | sed -n '/@@.*/,//{/@@.*/d;p}')
			FMT_OUTPUT="${FMT_OUTPUT}
<details><summary><code>${file}</code></summary>

\`\`\`diff
${FILE_DIFF}
\`\`\`
</details>
"
		done
		COMMENT="## ⚠ goimports Failed
${FMT_OUTPUT}
"
	fi

}

# check_lint is excute golint and generate ${COMMENT} and ${SUCCESS}
check_lint() {
	set +e
	OUTPUT=$(sh -c "golint -set_exit_status ./... $*" 2>&1)
	SUCCESS=$?

	set -e
	if [ ${SUCCESS} -eq 0 ]; then
		return
	fi

	if [ "${SEND_COMMNET}" = "true" ]; then
		COMMENT="## ⚠ golint Failed
$(echo "${OUTPUT}" | awk 'END{print}')
<details><summary>Show Detail</summary>

\`\`\`
$(echo "${OUTPUT}" | sed -e '$d')
\`\`\`

</details>
"
	fi
}

# check_sec is excute gosec and generate ${COMMENT} and ${SUCCESS}
check_sec() {
	set +e
	gosec -out /tmp/gosecresult.txt ${FLAGS} ./...
	SUCCESS=$?

	set -e
	if [ ${SUCCESS} -eq 0 ]; then
		return
	fi

	if [ "${SEND_COMMNET}" = "true" ]; then
		COMMENT="## ⚠ gosec Failed
\`\`\`
$(tail -n 6 /tmp/gosecresult.txt)
\`\`\`

<details><summary>Show Detail</summary>

\`\`\`
$(cat /tmp/gosecresult.txt)
\`\`\`
[Code Reference](https://github.com/securego/gosec#available-rules)
</details>
"
	fi
	rm /tmp/gosecresult.txt
}

# check_shadow is excute "go vet -vettool=/go/bin/shadow" and generate ${COMMENT} and ${SUCCESS}
check_shadow() {
	set +e
	OUTPUT=$(sh -c "go vet -vettool=$(which shadow) ${FLAGS} ./... $*" 2>&1)
	SUCCESS=$?

	set -e
	if [ ${SUCCESS} -eq 0 ]; then
		return
	fi

	if [ "${SEND_COMMNET}" = "true" ]; then
		COMMENT="## ⚠ shadow Failed
\`\`\`
${OUTPUT}
\`\`\`
"
	fi
}

# check_staticcheck is excute "staticcheck" and generate ${COMMENT} and ${SUCCESS}
check_staticcheck() {
	set +e
	OUTPUT=$(sh -c "staticcheck ${FLAGS} ./... $*" 2>&1)
	SUCCESS=$?

	set -e
	if [ ${SUCCESS} -eq 0 ]; then
		return
	fi

	if [ "${SEND_COMMNET}" = "true" ]; then
		COMMENT="## ⚠ staticcheck Failed
\`\`\`
${OUTPUT}
\`\`\`
[Checks Document](https://staticcheck.io/docs/checks)
"
	fi
}

# check_vet is excute "go vet" and generate ${COMMENT} and ${SUCCESS}
check_vet() {
	set +e
	OUTPUT=$(sh -c "go vet ${FLAGS} ./... $*" 2>&1)
	SUCCESS=$?

	set -e
	if [ ${SUCCESS} -eq 0 ]; then
		return
	fi

	if [ "${SEND_COMMNET}" = "true" ]; then
		COMMENT="## ⚠ vet Failed
\`\`\`
${OUTPUT}
\`\`\`
"
	fi
}


# ------------------------
#  Main Flow
# ------------------------
cd ${GITHUB_WORKSPACE:-.}/${WORKING_DIR:-.}

for i in {errcheck,fmt,imports,lint,sec,shadow,staticcheck,vet}; do
case $i in
	"errcheck" )
		mod_download
		check_errcheck
		;;
	"fmt" )
		check_fmt
		;;
	"imports" )
		check_imports
		;;
	"lint" )
		check_lint
		;;
	"sec" )
		mod_download
		check_sec
		;;
	"shadow" )
		mod_download
		check_shadow
		;;
	"staticcheck" )
		mod_download
		check_staticcheck
		;;
	"vet" )
		mod_download
		check_vet
		;;
	* )
		echo "Invalid command"
		exit 1

esac

if [ ${SUCCESS} -ne 0 ]; then
	echo "Check Failed!!"
	echo ${COMMENT}
  echo
  body=${COMMENT}
	body="${body//'%'/'%25'}"
  body="${body//$'\n'/'%0A'}"
  body="${body//$'\r'/'%0D'}" 
  echo ::set-output name=body::$body
  exit ${SUCCESS}
fi
done
