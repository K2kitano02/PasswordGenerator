import { Controller } from "@hotwired/stimulus"

// ゲスト用パスワード生成機: 長さ 6–18（メイン機能と統一）、数字・記号・大文字・小文字トグル、コピー・再生成
export default class extends Controller {
  static targets = [
    "output",
    "lengthValue",
    "lengthSlider",
    "numbers",
    "symbols",
    "uppercase",
    "lowercase",
    "copyIcon"
  ]

  connect() {
    this.regenerate()
  }

  updateLength() {
    if (this.hasLengthValueTarget) {
      this.lengthValueTarget.textContent = this.length
    }
    this.regenerate()
  }

  regenerate() {
    const length = this.length
    const charset = this.charset
    if (charset.length === 0) {
      if (this.hasOutputTarget) this.outputTarget.textContent = ""
      return
    }
    const password = this.generate(length, charset)
    if (this.hasOutputTarget) this.outputTarget.textContent = password
  }

  copy() {
    const value = this.hasOutputTarget ? this.outputTarget.textContent : ""
    if (!value) return
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
    navigator.clipboard.writeText(value).then(() => {
      if (!this.hasCopyIconTarget) return
      const icon = this.copyIconTarget
      icon.textContent = "check"
      icon.classList.add("!text-emerald-400")
      this._copyTimeout = setTimeout(() => {
        icon.textContent = "content_copy"
        icon.classList.remove("!text-emerald-400")
        this._copyTimeout = null
      }, 2000)
    })
  }

  get length() {
    if (!this.hasLengthSliderTarget) return 12
    const n = parseInt(this.lengthSliderTarget.value, 10)
    return (n >= 6 && n <= 18) ? n : 12
  }

  get charset() {
    let s = ""
    if (this.hasNumbersTarget && this.numbersTarget.checked) s += "0123456789"
    if (this.hasSymbolsTarget && this.symbolsTarget.checked) s += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if (this.hasUppercaseTarget && this.uppercaseTarget.checked) s += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (this.hasLowercaseTarget && this.lowercaseTarget.checked) s += "abcdefghijklmnopqrstuvwxyz"
    return s
  }

  generate(length, charset) {
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset[arr[i] % charset.length]
    }
    return result
  }
}
