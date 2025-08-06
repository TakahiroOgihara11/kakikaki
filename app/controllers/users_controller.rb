class UsersController < ApplicationController
 def show
   @user = User.find(params[:id])
   @recent_tweets = @user.tweets.includes(:likes, :comments).order(created_at: :desc).limit(3)
 end

  def index
    @users = User.where.not(id: current_user.id) # 自分以外を表示
    if params[:search].present?
      search = params[:search]
      @users = @users.where("name LIKE ?", "%#{search}%")
    end
  end

  def followings
    @user = User.find(params[:id])
    @users = @user.followings
  end

  def followers
    @user = User.find(params[:id])
    @users = @user.followers
  end
  
  def user_params
   params.require(:user).permit(:name, :email, :profile_image)
  end

end


