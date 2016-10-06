set backupcopy=yes
let s:path = expand('<sfile>:p:h')
let g:syntastic_typescript_checkers = ['tslint']
let g:syntastic_javascript_checkers = ['eslint']
let g:syntastic_yaml_checkers = ['jsyaml']
let NERDTreeShowHidden=1

:function Autoformat()
:  if exists(":Autoformat") | :Autoformat | endif
:endfunction

execute 'au BufWrite '.s:path.'/src/*.ts :call Autoformat()'
execute 'au BufWrite '.s:path.'/.eslintrc.json :call Autoformat()'
execute 'au BufWrite '.s:path.'/*.json :call Autoformat()'
execute 'au BufWrite '.s:path.'/*.js :call Autoformat()'
execute 'au BufWrite '.s:path.'/*.yml :call Autoformat()'
