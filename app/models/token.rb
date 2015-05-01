# Copyright (C) 2012-2014 Zammad Foundation, http://zammad-foundation.org/

class Token < ActiveRecord::Base
  before_create           :generate_token

  belongs_to              :user

  def self.check( data )

    # fetch token
    token = Token.where( action: data[:action], name: data[:name] ).first
    return if !token

    # check if token is still valid
    if !token.persistent &&
       token.created_at < 1.day.ago

      # delete token
      token.delete
      token.save
      return
    end

    # return token if valid
    token.user
  end

  private

  def generate_token
    begin
      self.name = SecureRandom.hex(20)
    end while Token.exists?( name: self.name )
  end
end
