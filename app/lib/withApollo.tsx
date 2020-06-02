import React from 'react'
import cookie from 'cookie'
import PropTypes from 'prop-types'
import { getDataFromTree } from 'react-apollo'
import Head from 'next/head'

import initApollo from './initApollo'

function parseCookies(req, options = {}) {
  const result = cookie.parse(req ? req.headers.cookie || '' : document.cookie, options)
  console.log('parseCookies', result)
  return result
}

export default App => {
  return class WithData extends React.Component {
    apolloClient: any
    static async getInitialProps(ctx) {
      const getCookie = req => { const result = (req ? req.headers.cookie || '' : document.cookie); return result; }
      const { Component, router, ctx: { req, res } } = ctx
      const token = getCookie(req);
      const apollo = initApollo({}, { getToken: () => getCookie(req) })
      ctx.ctx.apolloClient = apollo;
      let appProps = {};
      if (App.getInitialProps) { appProps = await App.getInitialProps(ctx) }
      if (res && res.finished) { return {} }
      if (!process.browser) {
        try {
          await getDataFromTree(<App {...appProps} Component={Component} router={router} apolloClient={apollo} />)
        } catch (error) { console.error('Error while running `getDataFromTree`', error) }
        Head.rewind()
      }
      const apolloState = apollo.cache.extract(); return { ...appProps, apolloState, token };
    }
    constructor(props) { super(props); this["apolloClient"] = initApollo(props.apolloState, { getToken: () => props.token }) }
    render() { return <App {...this.props} apolloClient={this.apolloClient} /> }
  }
}
