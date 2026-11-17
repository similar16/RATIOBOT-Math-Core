/* Keep credential fields in their own forms, separate from arithmetic and modeling answers.
   Browser-level password-saving preferences remain under the user's browser control. */
(function(){'use strict';
 const forms=document.querySelectorAll('form[data-credential-form]');
 for(const form of forms){
  form.addEventListener('submit',event=>event.preventDefault());
  // Existing button/Enter handlers own authentication; never submit passwords as native form data.
  for(const field of form.querySelectorAll('input')){
   field.setAttribute('data-lpignore','true');
   field.setAttribute('data-1p-ignore','');
  }
 }
})();
