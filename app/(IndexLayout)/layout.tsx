import "../globals.css";
import Link from "next/link";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="navbar navbar-index">
        <Link href="/">홈</Link>
        <Link href="/parallel">페러렐</Link>
        <Link href="/dependent">디펜던트</Link>
        <Link href="/paginated">페이지네이트</Link>
        <Link href="/infinite">인피니트</Link>
        <Link href="/todos">뮤테이션</Link>
      </div>
      {children}
    </>
  );
}
