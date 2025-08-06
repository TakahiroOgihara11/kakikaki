class CommentsController < ApplicationController

  before_action :authenticate_user!

 def create
   tweet = Tweet.find(params[:tweet_id])
   comment = tweet.comments.build(comment_params)
   comment.user_id = current_user.id
 
   if comment.save
     session[:show_all_following_posts] = true # コメント直後に全件表示
     flash[:success] = "コメントしました"
     redirect_back(fallback_location: root_path)
   else
     flash[:error] = "コメントできませんでした"
     redirect_back(fallback_location: root_path)
   end
 end
  
  def destroy
    @comment.destroy
    flash[:notice] = "コメントを削除しました"
    redirect_back(fallback_location: root_path)
  end

  private

  def comment_params
    params.require(:comment).permit(:content)
  end
end
