# Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

RSpec.describe Webhook, type: :request do
  let(:agent) { create(:agent) }
  let(:admin) { create(:admin) }

  describe 'request handling', authenticated_as: :admin do
    context 'when listing webhooks' do
      let!(:webhooks) { create_list(:webhook, 10) }

      before do
        get '/api/v1/webhooks.json'
      end

      it 'returns all' do
        expect(json_response.length).to eq(webhooks.length)
      end

      context 'with agent permissions', authenticated_as: :agent do
        it 'request is forbidden' do
          expect(response).to have_http_status(:forbidden)
        end
      end
    end

    context 'when showing webhook' do
      let!(:webhook) { create(:webhook) }

      before do
        get "/api/v1/webhooks/#{webhook.id}.json"
      end

      it 'returns ok' do
        expect(response).to have_http_status(:ok)
      end

      context 'with inactive template' do
        let!(:webhook) { create(:webhook, active: false) } # rubocop:disable RSpec/LetSetup

        it 'returns ok' do
          expect(response).to have_http_status(:ok)
        end
      end

      context 'with agent permissions', authenticated_as: :agent do
        it 'request is forbidden' do
          expect(response).to have_http_status(:forbidden)
        end
      end
    end

    context 'when creating webhook' do
      before do
        post '/api/v1/webhooks.json', params: { name: 'Foo', endpoint: 'http://example.com/endpoint', ssl_verify: true, active: true }
      end

      it 'returns created' do
        expect(response).to have_http_status(:created)
      end

      context 'with agent permissions', authenticated_as: :agent do
        it 'request is forbidden' do
          expect(response).to have_http_status(:forbidden)
        end
      end
    end

    context 'when updating webhook' do
      let!(:webhook) { create(:webhook) }

      before do
        put "/api/v1/webhooks/#{webhook.id}.json", params: { name: 'Foo' }
      end

      it 'returns ok' do
        expect(response).to have_http_status(:ok)
      end

      context 'with agent permissions', authenticated_as: :agent do
        it 'request is forbidden' do
          expect(response).to have_http_status(:forbidden)
        end
      end
    end

    context 'when destroying webhook' do
      let!(:webhook) { create(:webhook) }

      before do
        delete "/api/v1/webhooks/#{webhook.id}.json"
      end

      it 'returns ok' do
        expect(response).to have_http_status(:ok)
      end

      context 'with agent permissions', authenticated_as: :agent do
        it 'request is forbidden' do
          expect(response).to have_http_status(:forbidden)
        end
      end
    end

    context 'when fetching pre-defined webhooks' do
      before do
        get '/api/v1/webhooks/pre_defined.json'
      end

      it 'returns ok' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns an array' do
        expect(json_response).to be_an_instance_of(Array)
      end

      context 'with agent permissions', authenticated_as: :agent do
        it 'request is forbidden' do
          expect(response).to have_http_status(:forbidden)
        end
      end
    end

    context 'when fetching custom payload replacements' do
      before do
        get '/api/v1/webhooks/payload/replacements.json'
      end

      it 'returns ok' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a hash' do
        expect(json_response).to be_an_instance_of(Hash)
      end

      context 'with agent permissions', authenticated_as: :agent do
        it 'request is forbidden' do
          expect(response).to have_http_status(:forbidden)
        end
      end
    end
  end
end
