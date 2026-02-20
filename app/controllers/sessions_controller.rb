# ログイン（サインイン）・ログアウトを扱うコントローラー。
# ※ Session モデルは使わず、Rails の session（ハッシュ）に user_id を入れて「誰でログイン中か」を保持する。
class SessionsController < ApplicationController
  # GET /login … ログイン画面を表示するだけ（フォーム用のモデルは不要）
  def new
  end

  # POST /login … 送られたメール・パスワードでユーザーを照合し、成功したら session に user_id を入れてダッシュボードへ
  def create
    user = User.find_by(email: session_params[:email])

    # find_by で見つかり、かつ authenticate(パスワード) が true ならログイン成功
    if user&.authenticate(session_params[:password])
      session[:user_id] = user.id
      redirect_to dashboard_path, notice: "ログインしました"
    else
      flash.now[:alert] = "メールアドレスまたはパスワードが正しくありません"
      render :new, status: :unprocessable_entity
    end
  end

  # DELETE /login … ログアウト（session から user_id を削除してトップへ）
  def destroy
    session.delete(:user_id)
    redirect_to root_path, notice: "ログアウトしました"
  end

  private

  # ログイン用のパラメータ。password_confirmation は不要（登録時だけ使う）
  def session_params
    params.require(:session).permit(:email, :password)
  end
end
