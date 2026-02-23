class Password < ApplicationRecord
  belongs_to :user
  encrypts :password #dbには暗号化され保存される
  validates :password, presence: true
end