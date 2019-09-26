<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/map">Map</router-link> |
      <router-link to="/tdt">TDT</router-link>
    </div>
    <div id="main">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
html,body{
  width: 100%;
  height: 100%;
  margin: 0;
  #app {
    width: 100%;
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    #nav {
      height: 10%;
      line-height: 95px;
      a {
        font-weight: bold;
        color: #2c3e50;
        &.router-link-exact-active {
          color: #42b983;
        }
      }
    }
    #main{
      width: 100%;
      height: 90%;
    }
  }
}
</style>
