class AddEntropyBitsToPasswords < ActiveRecord::Migration[7.2]
  def change
    add_column :passwords, :entropy_bits, :integer
  end
end
