require 'sinatra'
require 'net/http'
require 'json'

get '/' do
  File.read('views/index.html')
end

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

post '/favorites' do
  file = JSON.parse(File.read('data.json'))
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end
  movie = { name: params[:name], oid: params[:oid], favorite: params[:favorite] }
  file << movie
  File.write('data.json',JSON.pretty_generate(file))
  movie.to_json
end
