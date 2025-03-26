import { useState } from "react";

const RetweetButton = ({
  contract,
  account,
  tweetAuthor,
  tweetId,
  getTweets,
}) => {
  const [loading, setLoading] = useState(false);

  const retweet = async () => {
    if (!contract || !account) {
      console.error(
        "Web3 or contract not initialized or account not connected."
      );
      return;
    }
    try {
      setLoading(true);
      await contract.methods
        .retweet(tweetAuthor, tweetId)
        .send({ from: account });
      getTweets(); // Refresh the tweets after retweeting
    } catch (error) {
      console.error("Error retweeting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={retweet} disabled={loading}>
      {loading ? "Retweeting..." : "🔁 Retweet"}
    </button>
  );
};

export default RetweetButton;
