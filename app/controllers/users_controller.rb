class UsersController < ApplicationController
 def show
   @user = User.find(params[:id])
   @recent_tweets = @user.tweets.includes(:likes, :comments).order(created_at: :desc).limit(3)
 end

  def index
    if params[:search].present?
      @users = User.where.not(id: current_user.id)
                   .where("name LIKE ?", "%#{params[:search]}%")
      @search_mode = true
    else
      @users = User.where.not(id: current_user.id)
                   .order(created_at: :desc)
                   .limit(5)
      @search_mode = false
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


