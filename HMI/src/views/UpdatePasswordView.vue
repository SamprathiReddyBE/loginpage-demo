<template>
    <div class="Updatepassword">
      <h1>Update Your Password</h1>
      <br />
      <div class="container">
        <div class="row">
          <form @submit.prevent="changePassword">
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Enter Username" v-model="username"/>
              <input type="password" class="form-control" placeholder="Enter password" v-model="password" />
              <input type="password" class="form-control" placeholder="Re-Enter password" v-model="confirmPassword" />
            </div>
            <br />
            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import router from '@/router';
  import { handleUpdatePassword, validateUsername } from '@/services/apiservices';
  
  export default {
    name: "ChangePassword",
    data() {
      return {
        username: "",
        password: "",
        confirmPassword: ""
      };
    },
    
    methods: {
      
      async changePassword() {
        if (this.password !== this.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
  
        try {
          const usernameExists = await validateUsername(this.username);
          if (!usernameExists) {
            alert("Username does not exist");
            return;
          }
  
          await handleUpdatePassword(this.username, this.password); // Sending username and password separately
          console.log("Password updated successfully");
          alert("Password updated successfully");
          router.push('/login');
          // Optionally redirect the user to the login page
        } catch (error) {
          console.error("Error updating password:", error);
          alert("Failed to update password. Please try again later.");
        }
      }
    }
  };
  </script>
  