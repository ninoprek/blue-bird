'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";



export default function Tweets({tweets}: {tweets: TweetWithAuthor[]}) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase.channel('realtime tweets').on('postgres_changes',
    {
        event: '*',
        schema: 'public',
        table: 'tweets'
    }, (payload) => {
      router.refresh();

    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [supabase, router]);

  const [optimisticTweets, addOptimisticTweets] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(tweets,
    (currentOptimisticTweets, newTweet) => {
      const newOptimisticTweets = [...currentOptimisticTweets];
      const index = newOptimisticTweets.findIndex(tweet => tweet.id === newTweet.id);
      newOptimisticTweets[index] = newTweet;

      return newOptimisticTweets;
    }
  );

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id} className="border border-gray-800 border-t-0 px-4 py-8 flex">
      <div className="h-12 w-12 ">
        <Image
          className="rounded-full"
          src={tweet.author.avatar_url}
          alt="tweet user avatar"
          height={48}
          width={48}
        />
      </div>
      <div className="ml-4">
        <p>
          <span className="font-bold">{tweet.author.name}</span>
          <span className="text-small ml-2 text-gray-400">{tweet.author.username}</span>
        </p>
        <p>{tweet.title}</p>
        <Likes tweet={tweet} addOptimisticTweets={addOptimisticTweets}/>
      </div>
    </div>
  ))
}