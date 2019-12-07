{
  module: {
    loaders: [
        {include: /\.json$/, loaders: ["json-loader"]}
    ]
  },
  resolve: {
    extensions: ['', '.json', '.jsx', '.js']
  }
}