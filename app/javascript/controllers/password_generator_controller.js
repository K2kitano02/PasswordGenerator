import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "output",
    "lengthValue",
    "lengthSlider",
    "uppercase",
    "lowercase",
    "numbers",
    "symbols",
    "strengthLabel",
    "entropyLabel",
    "entropyBits",
    "strengthBarFill",
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
      if (this.hasOutputTarget) this.outputTarget.value = ""
      return
    }
    const password = this.generate(length, charset)
    if (this.hasOutputTarget) this.outputTarget.value = password
    this.updateStrength(password)
  }

  copy() {
    const value = this.hasOutputTarget ? this.outputTarget.value : ""
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
    if (this.hasUppercaseTarget && this.uppercaseTarget.checked) s += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (this.hasLowercaseTarget && this.lowercaseTarget.checked) s += "abcdefghijklmnopqrstuvwxyz"
    if (this.hasNumbersTarget && this.numbersTarget.checked) s += "0123456789"
    if (this.hasSymbolsTarget && this.symbolsTarget.checked) s += "!@#$%^&*()_+-=[]{}|;:,.<>?"
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

  // 強度ロジック: 6〜8文字かつ記号なし→弱い(1), 6〜8文字で記号あり→普通(2), 9文字以上→強(3)
  // 提案: 9文字以上でも英数字のみなら「普通」にする／8文字未満を一律「弱い」にする等でさらに厳格化可能
  updateStrength(password) {
    const len = password.length
    const hasSymbols = this.hasSymbolsTarget && this.symbolsTarget.checked
    let label = "弱い"
    let level = 1
    if (len >= 9) {
      label = "強"
      level = 3
    } else if (len >= 6 && len <= 8) {
      if (hasSymbols) {
        label = "普通"
        level = 2
      } else {
        label = "弱い"
        level = 1
      }
    } else {
      label = "弱い"
      level = 1
    }
    if (this.hasStrengthLabelTarget) this.strengthLabelTarget.textContent = label
    if (this.hasEntropyLabelTarget) this.entropyLabelTarget.textContent = `強度レベル: ${label}`
    if (this.hasEntropyBitsTarget) this.entropyBitsTarget.value = level
    if (this.hasStrengthBarFillTarget) {
      const fill = this.strengthBarFillTarget
      const widths = { 1: "33%", 2: "66%", 3: "100%" }
      const colorClasses = { 1: "bg-red-500", 2: "bg-orange-500", 3: "bg-primary" }
      fill.style.width = widths[level] || "33%"
      fill.classList.remove("bg-red-500", "bg-orange-500", "bg-primary")
      fill.classList.add(colorClasses[level] || "bg-red-500")
    }
  }
}
