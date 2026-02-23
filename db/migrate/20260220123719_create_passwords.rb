class CreatePasswords < ActiveRecord::Migration[7.2]
  def change
    create_table :passwords do |t|
      t.string :website_url, null: true
      t.string :username, null: true
      t.string :password, null: false
      t.text :memo, null: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
