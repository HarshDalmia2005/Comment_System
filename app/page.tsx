import Image from "next/image";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Comments from "@/components/Comments";
export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/Auth/login");
  return (
    <div className="flex flex-col items-center justify-center py-2 px-4">
      <Post />
      <Comments />
    </div>
  );
}
