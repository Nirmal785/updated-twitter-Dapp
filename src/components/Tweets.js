import LikeButton from "./LikeButton"; // Import the LikeButton component
import RetweetButton from "./RetweetButton"; // Import the RetweetButton component

const Tweets = ({ tweets, contract, account, getTweets, shortAddress }) => {
  return (
    <div id="tweetsContainer">
      {tweets.map((tweet, index) => (
        <div key={index} className="tweet">
          <img
            className="user-icon"
            src={`https://api.dicebear.com/9.x/adventurer/svg`}
            alt="User Icon"
          />
          <div className="tweet-inner">
            <div className="author">{shortAddress(tweet.author)}</div>
            <div className="content">{tweet.content}</div>

            {/* Add Like and Retweet buttons */}
            <div className="tweet-actions">
              <LikeButton
                contract={contract}
                account={account}
                tweetAuthor={tweet.author}
                tweetId={tweet.id}
                initialLikes={tweet.likes}
                getTweets={getTweets}
              />
              <RetweetButton
                contract={contract}
                account={account}
                tweetAuthor={tweet.author}
                tweetId={tweet.id}
                getTweets={getTweets}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tweets;
