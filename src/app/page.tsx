import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Decimal } from "@prisma/client/runtime/library"; // Ensure Decimal is imported from Prisma

export default async function Home() {
  const hello = await api.post.hello({ text: "from iFinStrats" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        {session && <RealisedPnlDisplay />}
      </div>
    </main>
  );
}

async function RealisedPnlDisplay() {
  const session = await getServerAuthSession();
  if (!session?.user?.email) return null;

  // Fetch realisedPnl data
  const realisedPnlData = await api.realisedPnl.doJob({
    fromDate: '2023-01-01', // Example date, you might want to make it dynamic
    toDate: '2023-12-31', // Example date, you might want to make it dynamic
    email: session.user.email,
    entryType: 'EQUITY', // Example entryType, you might want to make it dynamic
  });

  return (
    <div className="w-full max-w-xs">
      {realisedPnlData.length > 0 ? (
        realisedPnlData.map((pnl) => (
          <p key={pnl.date.toString()} className="truncate">
            {pnl.date.toString()}: {pnl.pnl instanceof Decimal ? pnl.pnl.toString() : pnl.pnl}
          </p>
        ))
      ) : (
        <p>You have no realised PnL data yet.</p>
      )}
    </div>
  );
}