<template>
    <div class="login-container">
      <h2>Please Login to your account</h2>
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
      <p v-if="error" class="error-message">{{ error }}</p>
      <form @submit.prevent="login">
        <div class="input-container">
          <i class='bx bx-user'></i>
          <input v-model="username" type="text" required placeholder="Username" />
          <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
        </div>
        
        <div class="input-container">
          <i :class="showPassword ? 'bx bxs-show' : 'bx bxs-hide'" @click="togglePasswordVisibility"></i>
          <input v-model="password" :type="showPassword ? 'text' : 'password'" required placeholder="Password" />
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        </div>
        
        <p><router-link to="/UpdatePassword">Forgot password?</router-link></p>
        <button type="submit">Login</button>
      </form>   
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
      <div class="carousel"></div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { handleLogin, validateUsername } from '../services/apiservices';
  
  const router = useRouter();
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const usernameError = ref('');
  const passwordError = ref('');
  const showPassword = ref(false);
  
  // Function to validate email format
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };
  
  const login = async () => { 
    // Reset previous errors
    error.value = '';
    usernameError.value = '';
    passwordError.value = '';
  
    // Validate username
    if (!username.value.trim()) {
      usernameError.value = 'Username is required';
      return;
    } else if (!validateEmail(username.value)) {
      usernameError.value = 'Please enter a valid email address';
      return;
    }
  
    // Validate password
    if (!password.value.trim()) {
      passwordError.value = 'Password is required';
      return;
    }
  
    try {
      const response = await handleLogin(username.value, password.value);
      const { token } = response.data;
  
      console.log('Login successful', response.data);
  
      // Save the token to localStorage
      localStorage.setItem('token', token);
  
      // Redirect to profile page
      router.push('/profile');
    } catch (error) {
      console.error('Login failed', error.response?.data.message || 'An unexpected error occurred');
      showError(error.response?.data.message || 'An unexpected error occurred');
    }
  };
  
  
  const showError = (errorMessage) => {
    error.value = errorMessage;
  
    // Clear the error message after 3 seconds
    setTimeout(() => {
      error.value = '';
      username.value = '';
      password.value = '';
    }, 3000);
  };
  
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  </script>
  
  <style scoped>
  .input-container {
    position: relative;
  }
  
  .input-container i {
    position: absolute;
    right: 10px;
    top: 20%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  
  /* Adjust icon size if needed */
  .input-container i.bx {
    font-size: 20px;
  }
  </style>
  