// import { notFound } from "next/navigation";

// import { getUserByUsername } from "@/lib/user-service";
// import { isFollowingUser } from "@/lib/follow-service";
// import { isBlockedByUser } from "@/lib/block-service";
// import { StreamPlayer } from "@/components/stream-player";

// interface UserPageProps {
//   params: {
//     username: string;
//   };
// };

// const UserPage = async ({
//   params
// }: UserPageProps) => {
//   const user = await getUserByUsername(params.username);

//   if (!user || !user.stream) {
//     notFound();
//   }

//   const isFollowing = await isFollowingUser(user.id);
//   const isBlocked = await isBlockedByUser(user.id);

//   if (isBlocked) {
//     notFound();
//   }

//   return ( 
//     <StreamPlayer
//       user={user}
//       stream={user.stream}
//       isFollowing={isFollowing}
//     />
//   );
// }
 
// export default UserPage;

import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { isBlockedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const { username } = await params; // Await and destructure username

  // Fetch user data in a single request (optional)
  const [user, isFollowing, isBlocked] = await Promise.all([
    getUserByUsername(username),
    isFollowingUser(username), // Pass username directly here
    isBlockedByUser(username), // Pass username directly here
  ]);

  // Check user existence and stream availability
  if (!user || !user.stream) {
    notFound();
    return; // Avoid rendering the player if user is not found
  }

  // Check if blocked after confirming user existence
  if (isBlocked) {
    notFound();
    return; // Avoid rendering the player if user is blocked
  }

  return (
    <StreamPlayer
      user={user}
      stream={user.stream}
      isFollowing={isFollowing}
    />
  );
};

export default UserPage;