class ApplicationController < ActionController::Base
    def after_sign_in_path_for(resource)
    user_path(resource)  # 例: /users/3
    end
      # deviseコントローラーにストロングパラメータを追加する          
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected
  def configure_permitted_parameters
    # サインアップ時にnameのストロングパラメータを追加
    devise_parameter_sanitizer.permit(:sign_up, keys:  [:name, :profile, :profile_image, :image])
    # アカウント編集の時にnameとprofileのストロングパラメータを追加
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :profile, :profile_image,  :image])
  end
end
