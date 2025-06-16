# To do list

- Transition image when change thumb

- Integrate Fit Finder to product detail page: https://fitanalytics.com/how-to-integrate

- CartItems in AppHeader.vue

- Update Review.vue component

- Chỉnh các a href="#" thành các url, ví dụ (href="/myaccount/login"), @click.prevent=""

- Add api cho các modal LoginForm, ForgotPassword, CreateAccount

- Thêm các trang customerservice/privacy -> Có hyperlink tới CreateAccount modal

- Thêm các trang /myaccount/login, /myaccount/...., /unsubscribe

- Checkbox sign up in CreateAccountModal not working

# Important notes to optimize

- Update head metadata for SEO (in app.vue)

- Use <NuxtLink>

- Minify css

- Compress your assets, ideally using Brotli

- Use HTTP2/HTTP3 for delivery

- Use fontaine to reduce CLS https://nuxt.com/docs/getting-started/styling#font-advanced-optimization

- It's recommended to use getters (() => value) over computed (computed(() => value)) 

- Product url: baseurl/products/slug/id -> use id for query product detail

- Store cart data in backend, store the cart id in the cookie. Make cookie HTTP secure. By reading cart id show cart items

- Lazy load for image slide in product page

- Lazy loading for component (https://mokkapps.de/vue-tips/lazy-load-components-in-nuxt-3)