class PasswordsController < ApplicationController
  before_action :require_login, except: [ :generator ]
  before_action :set_password, only: %i[show edit update destroy]

  # ゲスト用パスワード生成機（未ログインで表示）
  def generator
  end

  def index
    @user = current_user
    @passwords = current_user.passwords.order(updated_at: :desc)
    # entropy_bits: 1=弱い, 2=普通, 3=強
    @weak_count = current_user.passwords.where(entropy_bits: 1).count
    @safe_count = current_user.passwords.where(entropy_bits: [ 2, 3 ]).count
  end

  def new
    @user = current_user
    @password = current_user.passwords.build
  end

  def create
    @user = current_user
    @password = current_user.passwords.build(password_params)
    if @password.save
      redirect_to passwords_path, notice: "パスワードを作成しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @user = current_user
  end

  def edit
    @user = current_user
  end

  def update
    permitted = password_params
    permitted.delete(:password) if permitted[:password].blank?
    if @password.update(permitted)
      redirect_to password_path(@password), notice: "パスワードを更新しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @password.destroy
    redirect_to passwords_path, notice: "パスワードを削除しました"
  end

  private
  def set_password
    @password = current_user.passwords.find(params[:id])
  end

  def password_params
    params.require(:password).permit(:website_url, :username, :password, :memo, :entropy_bits)
  end
end
