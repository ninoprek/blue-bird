import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export default function NewTweet({ user }: { user: User }) {

  const addTweet = async (formData: FormData) => {
    'use server'
    console.log('Tweet added');

    const title = String (formData.get('title'));
    const supabase = createServerActionClient<Database>({ cookies });

    await supabase.from('tweets').insert({ title, user_id: user.id });

  }

  return (
    <form className="border border-gray-800" action={addTweet}>
      <div className="flex py-8 px-4">
        <div className="h-12 w-12">
          <Image
            src={user.user_metadata.avatar_url}
            alt="User avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input  type="text"
                name="title"
                className="bg-inherit flex-1 m-l-2 text-2xl leading-loose placeholder-gray-500 px-2"
                placeholder="What is happening?!"
        />
      </div>
    </form>
  )
}