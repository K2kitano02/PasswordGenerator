Rails.application.routes.draw do
  root "home#index"
  resource :users, only: %i[new create], path: "signup"
  resource :session, only: %i[new create destroy], path: "login"
  resources :passwords, only: %i[index new create edit show update destroy], path: "passwords"

  
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end
