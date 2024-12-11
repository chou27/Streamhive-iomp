// import { currentUser } from "@clerk/nextjs/server";

// import { getUserByUsername } from "@/lib/user-service";
// import { StreamPlayer } from "@/components/stream-player";

// interface CreatorPageProps {
//   params: {
//     username: string;
//   };
// };

// const CreatorPage = async ({
//   params,
// }: CreatorPageProps) => {
//   const externalUser = await currentUser();
//   const user = await getUserByUsername(params.username);

//   if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
//     throw new Error("Unauthorized");
//   }

//   return ( 
//     <div className="h-full">
//       <StreamPlayer
//         user={user}
//         stream={user.stream}
//         isFollowing
//       />
//     </div>
//   );
// }
 
// export default CreatorPage;

import { currentUser } from "@clerk/nextjs/server";
import { getUserByUsername } from "@/lib/user-service";
import { StreamPlayer } from "@/components/stream-player";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const { username } = await params; // Await params to access username
  const externalUser = await currentUser();
  const user = await getUserByUsername(username);

  if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
    return {
      notFound: true, // Return 404 Not Found for unauthorized access
    };
  }

  return (
    <div className="h-full">
      <StreamPlayer user={user} stream={user.stream} isFollowing />
    </div>
  );
};

export default CreatorPage;