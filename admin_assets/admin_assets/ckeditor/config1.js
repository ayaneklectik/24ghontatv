/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
  // Define changes to default configuration here. For example:
  // config.language = 'fr';
  // config.uiColor = '#AADC6E';
  config.width = 650;
  config.toolbar = 'Full';

  config.toolbar_Full =
  [
    ['Cut','Copy','Paste','PasteText','PasteFromWord', 'SpellChecker'],
    ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
    ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote','CreateDiv'],
    ['TextColor','BGColor'],
    '/',
    ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
    ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
    ['Format','Font','FontSize'],
  ];


};
