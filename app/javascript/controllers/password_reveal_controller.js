import { Controller } from "@hotwired/stimulus"

// パスワード詳細画面: パスワードの表示/非表示切り替え、パスワード・ユーザー名のコピー
export default class extends Controller {
  static values = {
    password: String,
    username: String
  }

  static targets = ["maskedDisplay", "plainDisplay", "toggleBtn", "toggleIcon", "copyUsernameIcon", "copyPasswordIcon"]

  connect() {
    this.visible = false
    if (this.hasPlainDisplayTarget) {
      this.plainDisplayTarget.textContent = this.passwordValue || ""
    }
  }

  toggle() {
    this.visible = !this.visible
    if (this.hasMaskedDisplayTarget) {
      this.maskedDisplayTarget.classList.toggle("hidden", this.visible)
    }
    if (this.hasPlainDisplayTarget) {
      this.plainDisplayTarget.classList.toggle("hidden", !this.visible)
      this.plainDisplayTarget.textContent = this.visible ? (this.passwordValue || "") : ""
    }
    if (this.hasToggleIconTarget) {
      this.toggleIconTarget.textContent = this.visible ? "visibility_off" : "visibility"
    }
  }

  copyPassword() {
    this.copyToClipboard(this.passwordValue || "", this.hasCopyPasswordIconTarget ? this.copyPasswordIconTarget : null)
  }

  copyUsername() {
    this.copyToClipboard(this.usernameValue || "", this.hasCopyUsernameIconTarget ? this.copyUsernameIconTarget : null)
  }

  copyToClipboard(text, iconEl) {
    if (!text) return
    this._revertOtherCopyIcon(iconEl)
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
    navigator.clipboard.writeText(text).then(() => {
      if (!iconEl) return
      iconEl.textContent = "check"
      iconEl.classList.add("!text-emerald-400")
      this._copyTimeout = setTimeout(() => {
        iconEl.textContent = "content_copy"
        iconEl.classList.remove("!text-emerald-400")
        this._copyTimeout = null
      }, 2000)
    })
  }

  _revertOtherCopyIcon(currentIconEl) {
    const revert = (el) => {
      if (el && el.textContent === "check") {
        el.textContent = "content_copy"
        el.classList.remove("!text-emerald-400")
      }
    }
    if (this.hasCopyUsernameIconTarget && this.copyUsernameIconTarget !== currentIconEl) {
      revert(this.copyUsernameIconTarget)
    }
    if (this.hasCopyPasswordIconTarget && this.copyPasswordIconTarget !== currentIconEl) {
      revert(this.copyPasswordIconTarget)
    }
  }
}
