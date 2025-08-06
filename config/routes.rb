Rails.application.routes.draw do
  devise_for :users

  get "up" => "rails/health#show", as: :rails_health_check

  resources :tweets do
    collection do
      get :following_posts
    end
    resources :comments, only: [:create, :destroy]
    resources :likes, only: [:create, :destroy]
  end

  resources :users, only: [:index, :show] do
   member do
     get :followings
     get :followers
   end
  end
  
  mount ActiveStorage::Engine => "/rails/active_storage"


  resources :relationships, only: [:create, :destroy]

  root 'tweets#index'
end



# Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

# Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
# Can be used by load balancers and uptime monitors to verify that the app is live.
