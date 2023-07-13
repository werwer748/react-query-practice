import "../globals.css";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

export default function ParallelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="navbar navbar-parallel">
        <Link href="/">홈</Link>
        <Link href="/parallel">페러렐?</Link>
        <Link href="/dependent">디펜던트?</Link>
        <Link href="/paginated">페이지네이트?</Link>
        <Link href="/infinite">인피니트?</Link>
      </div>
      {children}
    </>
  );
}
