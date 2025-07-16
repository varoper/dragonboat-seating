warning: in the working copy of 'README.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'dist/nichi.html', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/README.md b/README.md[m
[1mindex 58beeac..65059c1 100644[m
[1m--- a/README.md[m
[1m+++ b/README.md[m
[36m@@ -68,3 +68,11 @@[m [mThis section has moved here: [https://facebook.github.io/create-react-app/docs/d[m
 ### `npm run build` fails to minify[m
 [m
 This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)[m
[32m+[m
[32m+[m
[32m+[m[32m## Added on here[m
[32m+[m
[32m+[m
[32m+[m[32mTo run the server:[m[41m [m
[32m+[m
[32m+[m[32m    node server/index.js[m
\ No newline at end of file[m
[1mdiff --git a/dist/nichi.html b/dist/nichi.html[m
[1mindex 578b194..f75dfef 100644[m
[1m--- a/dist/nichi.html[m
[1m+++ b/dist/nichi.html[m
[36m@@ -5,8 +5,8 @@[m
   <meta charset="UTF-8" />[m
   <meta name="viewport" content="width=device-width, initial-scale=1">[m
   <title>Dragon Boat Seating</title>[m
[31m-  <script type="module" crossorigin src="/assets/index-CgLs2ENs.js"></script>[m
[31m-  <link rel="stylesheet" crossorigin href="/assets/index-lOsaMISl.css">[m
[32m+[m[32m  <script type="module" crossorigin src="/assets/index-FU2tc7RH.js"></script>[m
[32m+[m[32m  <link rel="stylesheet" crossorigin href="/assets/index-BJdXLEiZ.css">[m
 </head>[m
 [m
 <body>[m
[1mdiff --git a/dist/paddlers.csv b/dist/paddlers.csv[m
[1mindex 46c6f3e..89f8fff 100644[m
[1m--- a/dist/paddlers.csv[m
[1m+++ b/dist/paddlers.csv[m
[36m@@ -13,7 +13,6 @@[m [mDeirdre,100,either,drummer[m
 Denise,130,either,[m
 Donna,194,either,[m
 Eric,150,either,stern[m
[31m-Gustavo,200,either,[m
 Jackie,140,right,[m
 Jamie,125,either,[m
 Jennifer,175,either,[m
[36m@@ -21,7 +20,7 @@[m [mJessica,161,either,[m
 Josh,147,either,[m
 Juan,225,either,[m
 Karl,175,either,[m
[31m-Kyden,145,either,[m
[32m+[m[32mKyden,145,left,[m
 Luis,145,left,[m
 Michelle,128,either,[m
 Nina,125,either,[m
[36m@@ -32,4 +31,5 @@[m [mToru,170,left,[m
 Virginia,140,either,drummer[m
 Javi,170,none,stern[m
 Sean M,210,none,stern[m
[31m-Glenn,190,none,stern[m
\ No newline at end of file[m
[32m+[m[32mGlenn,180,none,stern[m
[32m+[m[32mAdrianne,160,none,stern[m
\ No newline at end of file[m
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex 9a21092..f7eacf5 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -27,6 +27,7 @@[m
       "devDependencies": {[m
         "@vitejs/plugin-react": "^4.4.1",[m
         "autoprefixer": "^10.4.21",[m
[32m+[m[32m        "concurrently": "^9.2.0",[m
         "postcss": "^8.5.3",[m
         "tailwindcss": "^3.4.1",[m
         "vite": "^6.3.5"[m
[36m@@ -1777,6 +1778,74 @@[m
         "node": ">= 6"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/cliui": {[m
[32m+[m[32m      "version": "8.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/cliui/-/cliui-8.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "string-width": "^4.2.0",[m
[32m+[m[32m        "strip-ansi": "^6.0.1",[m
[32m+[m[32m        "wrap-ansi": "^7.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=12"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/cliui/node_modules/emoji-regex": {[m
[32m+[m[32m      "version": "8.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/cliui/node_modules/string-width": {[m
[32m+[m[32m      "version": "4.2.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "emoji-regex": "^8.0.0",[m
[32m+[m[32m        "is-fullwidth-code-point": "^3.0.0",[m
[32m+[m[32m        "strip-ansi": "^6.0.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=8"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/cliui/node_modules/strip-ansi": {[m
[32m+[m[32m      "version": "6.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "ansi-regex": "^5.0.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=8"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/cliui/node_modules/wrap-ansi": {[m
[32m+[m[32m      "version": "7.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "ansi-styles": "^4.0.0",[m
[32m+[m[32m        "string-width": "^4.1.0",[m
[32m+[m[32m        "strip-ansi": "^6.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=10"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/color-convert": {[m
       "version": "2.0.1",[m
       "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",[m
[36m@@ -1805,6 +1874,48 @@[m
         "node": ">= 6"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/concurrently": {[m
[32m+[m[32m      "version": "9.2.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/concurrently/-/concurrently-9.2.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-IsB/fiXTupmagMW4MNp2lx2cdSN2FfZq78vF90LBB+zZHArbIQZjQtzXCiXnvTxCZSvXanTqFLWBjw2UkLx1SQ==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "chalk": "^4.1.2",[m
[32m+[m[32m        "lodash": "^4.17.21",[m
[32m+[m[32m        "rxjs": "^7.8.1",[m
[32m+[m[32m        "shell-quote": "^1.8.1",[m
[32m+[m[32m        "supports-color": "^8.1.1",[m
[32m+[m[32m        "tree-kill": "^1.2.2",[m
[32m+[m[32m        "yargs": "^17.7.2"[m
[32m+[m[32m      },[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "conc": "dist/bin/concurrently.js",[m
[32m+[m[32m        "concurrently": "dist/bin/concurrently.js"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=18"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "url": "https://github.com/open-cli-tools/concurrently?sponsor=1"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/concurrently/node_modules/supports-color": {[m
[32m+[m[32m      "version": "8.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-8.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "has-flag": "^4.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=10"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "url": "https://github.com/chalk/supports-color?sponsor=1"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/content-disposition": {[m
       "version": "1.0.0",[m
       "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-1.0.0.tgz",[m
[36m@@ -2309,6 +2420,16 @@[m
         "node": ">=6.9.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/get-caller-file": {[m
[32m+[m[32m      "version": "2.0.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "6.* || 8.* || >= 10.*"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/get-intrinsic": {[m
       "version": "1.3.0",[m
       "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",[m
[36m@@ -3750,6 +3871,16 @@[m
         "@babel/runtime": "^7.9.2"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/require-directory": {[m
[32m+[m[32m      "version": "2.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=0.10.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/resolve": {[m
       "version": "1.22.10",[m
       "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.10.tgz",[m
[36m@@ -3862,6 +3993,16 @@[m
         "queue-microtask": "^1.2.2"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/rxjs": {[m
[32m+[m[32m      "version": "7.8.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "Apache-2.0",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "tslib": "^2.1.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/safe-buffer": {[m
       "version": "5.2.1",[m
       "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",[m
[36m@@ -3973,6 +4114,19 @@[m
         "node": ">=8"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/shell-quote": {[m
[32m+[m[32m      "version": "1.8.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/shell-quote/-/shell-quote-1.8.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-ObmnIF4hXNg1BqhnHmgbDETF8dLPCggZWBjkQfhZpbszZnYur5DUljTcCHii5LC3J5E0yeO/1LIMyH+UvHQgyw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">= 0.4"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "url": "https://github.com/sponsors/ljharb"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/side-channel": {[m
       "version": "1.1.0",[m
       "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz",[m
[36m@@ -4378,6 +4532,16 @@[m
         "node": ">=0.6"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/tree-kill": {[m
[32m+[m[32m      "version": "1.2.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/tree-kill/-/tree-kill-1.2.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "tree-kill": "cli.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/ts-interface-checker": {[m
       "version": "0.1.13",[m
       "resolved": "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz",[m
[36m@@ -4686,6 +4850,16 @@[m
       "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",[m
       "license": "ISC"[m
     },[m
[32m+[m[32m    "node_modules/y18n": {[m
[32m+[m[32m      "version": "5.0.8",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",[m
[32m+[m[32m      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=10"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/yallist": {[m
       "version": "3.1.1",[m
       "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",[m
[36m@@ -4705,6 +4879,70 @@[m
       "engines": {[m
         "node": ">= 14"[m
       }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/yargs": {[m
[32m+[m[32m      "version": "17.7.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/yargs/-/yargs-17.7.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "cliui": "^8.0.1",[m
[32m+[m[32m        "escalade": "^3.1.1",[m
[32m+[m[32m        "get-caller-file": "^2.0.5",[m
[32m+[m[32m        "require-directory": "^2.1.1",[m
[32m+[m[32m        "string-width": "^4.2.3",[m
[32m+[m[32m        "y18n": "^5.0.5",[m
[32m+[m[32m        "yargs-parser": "^21.1.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=12"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/yargs-parser": {[m
[32m+[m[32m      "version": "21.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-21.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=12"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/yargs/node_modules/emoji-regex": {[m
[32m+[m[32m      "version": "8.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/yargs/node_modules/string-width": {[m
[32m+[m[32m      "version": "4.2.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "emoji-regex": "^8.0.0",[m
[32m+[m[32m        "is-fullwidth-code-point": "^3.0.0",[m
[32m+[m[32m        "strip-ansi": "^6.0.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=8"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/yargs/node_modules/strip-ansi": {[m
[32m+[m[32m      "version": "6.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "ansi-regex": "^5.0.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=8"[m
[32m+[m[32m      }[m
     }[m
   }[m
 }[m
[1mdiff --git a/package.json b/package.json[m
[1mindex eaa2950..a681362 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -22,14 +22,17 @@[m
   "devDependencies": {[m
     "@vitejs/plugin-react": "^4.4.1",[m
     "autoprefixer": "^10.4.21",[m
[32m+[m[32m    "concurrently": "^9.2.0",[m
     "postcss": "^8.5.3",[m
     "tailwindcss": "^3.4.1",[m
     "vite": "^6.3.5"[m
   },[m
   "scripts": {[m
[31m-    "dev": "vite",[m
[31m-    "build": "vite build",[m
[32m+[m[32m    "dev": "concurrently \"vite\" \"node server/index.js\"",[m
[32m+[m[32m    "build": "vite build && npm run postbuild",[m
     "postbuild": "rename dist\\index.html nichi.html",[m
[32m+[m[32m    "serve": "NODE_ENV=production node server/index.js",[m
[32m+[m[32m    "start": "npm run serve",[m
     "preview": "vite preview"[m
   },[m
   "eslintConfig": {[m
[36m@@ -50,4 +53,4 @@[m
       "last 1 safari version"[m
     ][m
   }[m
[31m-}[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/public/paddlers.csv b/public/paddlers.csv[m
[1mindex 46c6f3e..244c436 100644[m
[1m--- a/public/paddlers.csv[m
[1m+++ b/public/paddlers.csv[m
[36m@@ -1,6 +1,6 @@[m
 name,weight,side,role[m
 Alan,208,either,[m
[31m-Angela,165,either,[m
[32m+[m[32mAngela,165,left,[m
 Bailee,155,either,[m
 Becca,180,either,[m
 Brandon,185,either,[m
[36m@@ -13,7 +13,6 @@[m [mDeirdre,100,either,drummer[m
 Denise,130,either,[m
 Donna,194,either,[m
 Eric,150,either,stern[m
[31m-Gustavo,200,either,[m
 Jackie,140,right,[m
 Jamie,125,either,[m
 Jennifer,175,either,[m
[36m@@ -21,7 +20,7 @@[m [mJessica,161,either,[m
 Josh,147,either,[m
 Juan,225,either,[m
 Karl,175,either,[m
[31m-Kyden,145,either,[m
[32m+[m[32mKyden,145,left,[m
 Luis,145,left,[m
 Michelle,128,either,[m
 Nina,125,either,[m
[36m@@ -32,4 +31,5 @@[m [mToru,170,left,[m
 Virginia,140,either,drummer[m
 Javi,170,none,stern[m
 Sean M,210,none,stern[m
[31m-Glenn,190,none,stern[m
\ No newline at end of file[m
[32m+[m[32mGlenn,180,none,stern[m
[32m+[m[32mAdrianne,160,none,stern[m
\ No newline at end of file[m
[1mdiff --git a/server/index.js b/server/index.js[m
[1mindex 531496a..635b632 100644[m
[1m--- a/server/index.js[m
[1m+++ b/server/index.js[m
[36m@@ -4,10 +4,11 @@[m [mconst path = require('path');[m
 const cors = require('cors');[m
 [m
 const app = express();[m
[31m-const PORT = 5174; // dev server port separate from Vite[m
[32m+[m[32mconst PORT = process.env.PORT || 5174;[m
 [m
[31m-app.use(cors()); // allow local Vite frontend to access[m
[32m+[m[32mapp.use(cors());[m
 [m
[32m+[m[32m// API route for chart files[m
 app.get('/api/charts', (req, res) => {[m
     const chartsDir = path.join(__dirname, '../public/charts');[m
 [m
[36m@@ -22,6 +23,16 @@[m [mapp.get('/api/charts', (req, res) => {[m
     });[m
 });[m
 [m
[32m+[m[32m// Serve static files in production[m
[32m+[m[32mif (process.env.NODE_ENV === 'production') {[m
[32m+[m[32m    const distPath = path.join(__dirname, '../dist');[m
[32m+[m[32m    app.use(express.static(distPath));[m
[32m+[m
[32m+[m[32m    app.get('*', (req, res) => {[m
[32m+[m[32m        res.sendFile(path.join(distPath, 'nichi.html')); // Adjust if renamed differently[m
[32m+[m[32m    });[m
[32m+[m[32m}[m
[32m+[m
 app.listen(PORT, () => {[m
[31m-    console.log(`API server running on http://localhost:${PORT}`);[m
[32m+[m[32m    console.log(`Server running on http://localhost:${PORT}`);[m
 });[m
