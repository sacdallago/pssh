define({ "api": [
  {
    "type": "get",
    "url": "/md5/:md5",
    "title": "Request protein sequence information",
    "version": "0.1.0",
    "name": "getMd5",
    "group": "Get",
    "description": "<p>Returns the entry from <code>protein_sequence_unified</code> if <code>:md5</code> matches an entry, or error instead.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "md5",
            "description": "<p>Protein sequence MD5 hash.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response No Pssh",
          "content": "HTTP/1.1 200\n{\n \"data\": [\n   {\n      \"Primary_Accession\": null,\n      \"Sequence\": \"acb\",\n      \"MD5_Hash\": \"hash\",\n      \"Description\": null,\n      \"Length\": 3,\n     \"pssh_finished\": 0\n   }\n ],\n \"count\": 1\n}",
          "type": "json"
        },
        {
          "title": "Success Response has Pssh",
          "content": "HTTP/1.1 200\n{\n \"data\": [\n   {\n      \"Primary_Accession\": \"123\",\n      \"Sequence\": \"acb\",\n      \"MD5_Hash\": \"hash\",\n      \"Description\": \"abc\",\n      \"Length\": 3,\n     \"pssh_finished\": 1\n   }\n ],\n \"count\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>No data for the given protein found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal node error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotFound",
          "content": "HTTP/1.1 404\n{\n \"data\": [],\n \"count\": 0\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./services/proteinSequenceUnified.js",
    "groupTitle": "Get"
  },
  {
    "type": "get",
    "url": "/sequence/:sequence",
    "title": "Request protein sequence information",
    "version": "0.1.0",
    "name": "getSequence",
    "group": "Get",
    "description": "<p>Returns the entry from <code>protein_sequence_unified</code> if <code>:sequence</code> matches an entry, or error instead.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sequence",
            "description": "<p>Protein sequence.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response No Pssh",
          "content": "HTTP/1.1 200\n{\n \"data\": [\n   {\n      \"Primary_Accession\": null,\n      \"Sequence\": \"acb\",\n      \"MD5_Hash\": \"hash\",\n      \"Description\": null,\n      \"Length\": 3,\n     \"pssh_finished\": 0\n   }\n ],\n \"count\": 1\n}",
          "type": "json"
        },
        {
          "title": "Success Response has Pssh",
          "content": "HTTP/1.1 200\n{\n \"data\": [\n   {\n      \"Primary_Accession\": \"123\",\n      \"Sequence\": \"acb\",\n      \"MD5_Hash\": \"hash\",\n      \"Description\": \"abc\",\n      \"Length\": 3,\n     \"pssh_finished\": 1\n   }\n ],\n \"count\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>No data for the given protein found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal node error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotFound",
          "content": "HTTP/1.1 404\n{\n \"data\": [],\n \"count\": 0\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./services/proteinSequenceUnified.js",
    "groupTitle": "Get"
  },
  {
    "type": "post",
    "url": "/sequence",
    "title": "Submit a sequence to the database in the `user_sequences` table",
    "version": "0.1.0",
    "name": "postSequence",
    "group": "Post",
    "description": "<p>Inserts a sequence to be processes via PSSH. The calls can be formatted as <code>multipart/form-data</code>, <code>application/x-www-form-urlencoded</code> or <code>application/json</code>.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "nested",
            "description": "<p>An Object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Created",
          "content": "HTTP/1.1 201\n{\n \"fieldCount\": 0,\n \"affectedRows\": 1,\n \"insertId\": 0,\n \"serverStatus\": 2,\n \"warningCount\": 0,\n \"message\": \"\",\n \"protocol41\": true,\n \"changedRows\": 0\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nested.email",
            "description": "<p>Email of the submitter.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nested.sequence",
            "description": "<p>Sequence to be uploaded</p>"
          },
          {
            "group": "Parameter",
            "type": "Binary",
            "optional": false,
            "field": "nested.pssh",
            "description": "<p>[OPTIONAL] pssh calculation of <code>sequence</code> with corresponding md5 hash.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The <code>token</code> neccessary to perform POST requests, defined in the configuration.js</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Wrong or not token.</p>"
          }
        ],
        "415": [
          {
            "group": "415",
            "optional": false,
            "field": "UnsuportedMediaType",
            "description": "<p>Wrong method. Allowed methods: <code>multipart/form-data</code>, <code>application/x-www-form-urlencoded</code> or <code>application/json</code>.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>Most likely duplicate entry, see example below</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal node error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UnprocessableEntity ",
          "content": "HTTP/1.1 422\n{\n \"code\": \"ER_DUP_ENTRY\",\n \"errno\": 1062,\n \"sqlState\": \"23000\",\n \"index\": 0\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./services/proteinSequenceUser.js",
    "groupTitle": "Post"
  },
  {
    "type": "post",
    "url": "/sequence",
    "title": "Submit a sequence to the database in the `user_sequences` table",
    "version": "0.1.0",
    "name": "postSequence",
    "group": "Post",
    "description": "<p>Inserts a sequence to be processes via PSSH. The calls can be formatted as <code>multipart/form-data</code>, <code>application/x-www-form-urlencoded</code> or <code>application/json</code>.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "nested",
            "description": "<p>An Object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Created",
          "content": "HTTP/1.1 201\n{\n \"fieldCount\": 0,\n \"affectedRows\": 1,\n \"insertId\": 0,\n \"serverStatus\": 2,\n \"warningCount\": 0,\n \"message\": \"\",\n \"protocol41\": true,\n \"changedRows\": 0\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nested.email",
            "description": "<p>Email of the submitter.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nested.sequence",
            "description": "<p>Sequence to be uploaded</p>"
          },
          {
            "group": "Parameter",
            "type": "Binary",
            "optional": false,
            "field": "nested.pssh",
            "description": "<p>[OPTIONAL] pssh calculation of <code>sequence</code> with corresponding md5 hash.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The <code>token</code> neccessary to perform POST requests, defined in the configuration.js</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "Unauthorized",
            "description": ""
          }
        ],
        "415": [
          {
            "group": "415",
            "optional": false,
            "field": "UnsuportedMediaType",
            "description": ""
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": ""
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "UnprocessableEntity",
          "content": "HTTP/1.1 422\n{\n \"code\": \"ER_DUP_ENTRY\",\n \"errno\": 1062,\n \"sqlState\": \"23000\",\n \"index\": 0\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./services/proteinSequenceUser.js",
    "groupTitle": "Post"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "_home_chdallago_git_pssh_doc_main_js",
    "groupTitle": "_home_chdallago_git_pssh_doc_main_js",
    "name": ""
  }
] });
