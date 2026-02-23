import { Controller } from "@hotwired/stimulus"

// オンボーディング: 2スライド、一定時間で自動切り替え or タップで切り替え
export default class extends Controller {
  static targets = ["slide", "dot"]
  static values = { autoAdvanceMs: { type: Number, default: 5000 } }

  connect() {
    this.index = 0
    this.showSlide(this.index)
    this.startAutoAdvance()
  }

  disconnect() {
    this.stopAutoAdvance()
  }

  next(event) {
    if (event) event.preventDefault()
    if (this.index >= this.slideTargets.length - 1) return
    this.index += 1
    this.showSlide(this.index)
    this.resetAutoAdvance()
  }

  goTo(event) {
    const i = parseInt(event.currentTarget.dataset.index, 10)
    if (Number.isNaN(i) || i === this.index) return
    this.index = i
    this.showSlide(this.index)
    this.resetAutoAdvance()
  }

  showSlide(i) {
    this.index = i
    this.slideTargets.forEach((el, idx) => {
      el.classList.toggle("hidden", idx !== i)
    })
    this.dotTargets.forEach((el, idx) => {
      const isActive = idx === i
      el.classList.toggle("w-8", isActive)
      el.classList.toggle("w-2", !isActive)
      el.classList.toggle("bg-primary", isActive)
      el.classList.toggle("bg-slate-700", !isActive)
      el.classList.toggle("shadow-[0_0_10px_rgba(0,242,255,0.5)]", isActive)
    })
  }

  startAutoAdvance() {
    this.stopAutoAdvance()
    this._autoAdvanceTimer = setInterval(() => {
      if (this.index < this.slideTargets.length - 1) {
        this.index += 1
        this.showSlide(this.index)
      } else {
        this.stopAutoAdvance()
      }
    }, this.autoAdvanceMsValue)
  }

  stopAutoAdvance() {
    if (this._autoAdvanceTimer) {
      clearInterval(this._autoAdvanceTimer)
      this._autoAdvanceTimer = null
    }
  }

  resetAutoAdvance() {
    if (this.index < this.slideTargets.length - 1) {
      this.startAutoAdvance()
    } else {
      this.stopAutoAdvance()
    }
  }
}
