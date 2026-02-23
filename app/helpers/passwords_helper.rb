# frozen_string_literal: true

module PasswordsHelper
  # entropy_bits: 1=弱い, 2=普通, 3=強
  def password_strength_label(entropy_bits)
    case entropy_bits
    when 3 then "強"
    when 2 then "普通"
    else "弱い"
    end
  end

  def password_strength_bar_width(entropy_bits)
    case entropy_bits
    when 3 then "100%"
    when 2 then "66%"
    else "33%"
    end
  end

  def password_strength_bar_color_class(entropy_bits)
    case entropy_bits
    when 3 then "bg-primary"
    when 2 then "bg-orange-500"
    else "bg-red-500"
    end
  end

  def strength_color_class(entropy_bits)
    case entropy_bits
    when 3 then "text-primary"
    when 2 then "text-orange-500"
    else "text-red-500"
    end
  end

  def strength_percent(entropy_bits)
    case entropy_bits
    when 3 then "100"
    when 2 then "66"
    else "33"
    end
  end
end
