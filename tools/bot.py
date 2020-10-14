import asyncio
import sys
import os
import json

import aiohttp

server = os.getenv("SERVER", "http://localhost:8080")


def get_name(offset: int):
    return f"Bot{offset}"


RPCS = {"setName": "A", "startGame": "B"}


def serialize_rpc(method: str, arg):
    return RPCS[method] + json.dumps(arg)


async def send_rpc(ws, method: str, arg):
    print(serialize_rpc(method, arg))
    await ws.send_str(serialize_rpc(method, arg))


async def run_bot(sess: aiohttp.ClientSession, gid: str, offset: int):
    name = get_name(offset)
    print(f"Connecting with name: {name}")
    is_host = False
    async with sess.ws_connect(server + "/game/" + gid) as ws:
        await send_rpc(ws, "setName", name)

        async for msg in ws:
            print(msg.data)
            data = {}
            try:
                data = json.loads(msg.data)
            except:
                pass
            t = data.get("type")
            if t == "host":
                is_host = data.get("isHost", False)
            elif t == "players" and is_host:
                # Everytime someone joins/leaves, try to start the game
                #  Doesn't matter if it causes and error
                await send_rpc(ws, "startGame", {})


async def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <game id> <number of bots>", file=sys.stderr)

    gid = sys.argv[1]
    num_bots = int(sys.argv[2])

    tasks = []
    async with aiohttp.ClientSession() as sess:
        for i in range(1, num_bots + 1):
            tasks.append(asyncio.create_task(run_bot(sess, gid, i)))
        for t in tasks:
            await t


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
