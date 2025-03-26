import { useState } from "react";

const LikeButton = ({
  contract,
  account,
  tweetAuthor,
  tweetId,
  initialLikes,
  getTweets,
}) => {
  const [likes, setLikes] = useState(initialLikes); // Track like count
  const [isLiked, setIsLiked] = useState(false); // Track like status
  const [loading, setLoading] = useState(false); // Track loading state

  // Function to like a tweet
  const likeTweet = async () => {
    if (!contract || !account) {
      console.error("Web3 or contract not initialized.");
      return;
    }
    try {
      setLoading(true);
      await contract.methods
        .likeTweet(tweetAuthor, tweetId)
        .send({ from: account });
      setLikes(likes + 1);
      setIsLiked(true);
      getTweets(); // Refresh tweets
    } catch (error) {
      console.error("Error liking tweet:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to unlike a tweet
  const unlikeTweet = async () => {
    if (!contract || !account) {
      console.error("Web3 or contract not initialized.");
      return;
    }
    try {
      setLoading(true);
      await contract.methods
        .unlikeTweet(tweetAuthor, tweetId)
        .send({ from: account });
      setLikes(likes - 1);
      setIsLiked(false);
      getTweets(); // Refresh tweets
    } catch (error) {
      console.error("Error unliking tweet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={isLiked ? unlikeTweet : likeTweet}
      disabled={loading}
      style={{ color: isLiked ? "red" : "black" }}
    >
      {isLiked ? "❤️" : "🤍"} {likes}
    </button>
  );
};

export default LikeButton;
