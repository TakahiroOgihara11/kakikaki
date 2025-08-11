module ApplicationHelper
  def posted_today?(user)
    user.tweets.where(created_at: Time.zone.now.all_day).exists?
  end

end
