class TweetsController < ApplicationController
  before_action :authenticate_user!, except: [:index]

  def index
    @tweets = Tweet.all.order(created_at: :desc)
  end

  def new
    @tweet = Tweet.new
    @tweets = Tweet.all.order(created_at: :desc)
    @user = current_user
  end

  def show
    @tweet = Tweet.find(params[:id])
    @tweets = Tweet.where(user_id: @tweet.user_id)
  end

  def create
    @tweet = Tweet.new(tweet_params)
    @tweet.user_id = current_user.id
    if @tweet.save
      redirect_to user_path(current_user), notice:  "投稿が完了しました！"
    else
      render :new, alert: "投稿に失敗しました"
    end
  end

 def following_posts
   following_ids = current_user.followings.pluck(:id)
   today_range = Time.zone.now.beginning_of_day..Time.zone.now.end_of_day

   all_tweets = Tweet.includes(:user).where(user_id: following_ids, created_at: today_range).order(created_at: :desc)

   # コメント直後なら全件、そうでなければ1件だけ
   if session[:show_all_following_posts]
     @tweets = all_tweets
     session[:show_all_following_posts] = nil # 一度だけ表示
   else
     @tweets = all_tweets.limit(1)
   end

   @comment = Comment.new
 end

  private

  def tweet_params
    params.require(:tweet).permit(:name, :diary, :time, :image)
  end
end
