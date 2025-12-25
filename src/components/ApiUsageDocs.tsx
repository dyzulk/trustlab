'use client';

import { useState } from 'react';

// Simple Tab Component since we're using Tailwind directly
function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="w-full">
            <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap focus:outline-none ${
                            activeTab === index
                                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg mt-0">
                {tabs[activeTab].content}
            </div>
        </div>
    );
}

function CodeBlock({ code }: { code: string }) {
    return (
        <pre className="p-3 bg-gray-900 text-gray-100 rounded text-sm overflow-x-auto">
            <code>{code}</code>
        </pre>
    );
}

export default function ApiUsageDocs({ apiKey = 'YOUR_API_KEY' }: { apiKey?: string }) {
    const baseUrl = 'https://trustlab-api.dyzulk.com/api/v1';
    
    // Snippet Generators
    const snippets = [
        {
            label: 'cURL',
            code: `curl -X GET "${baseUrl}/certificates" \\
     -H "TRUSTLAB_API_KEY: ${apiKey}" \\
     -H "Accept: application/json"`
        },
        {
            label: 'PHP',
            code: `<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => '${baseUrl}/certificates',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'TRUSTLAB_API_KEY: ${apiKey}',
    'Accept: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;`
        },
        {
            label: 'Python',
            code: `import requests

url = "${baseUrl}/certificates"

payload={}
headers = {
  'TRUSTLAB_API_KEY': '${apiKey}',
  'Accept': 'application/json'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)`
        },
        {
            label: 'Node.js',
            code: `const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '${baseUrl}/certificates',
  headers: { 
    'TRUSTLAB_API_KEY': '${apiKey}', 
    'Accept': 'application/json'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});`
        },
        {
            label: 'JavaScript',
            code: `var myHeaders = new Headers();
myHeaders.append("TRUSTLAB_API_KEY", "${apiKey}");
myHeaders.append("Accept", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("${baseUrl}/certificates", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));`
        },
        {
            label: 'Ruby',
            code: `require "uri"
require "net/http"

url = URI("${baseUrl}/certificates")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["TRUSTLAB_API_KEY"] = "${apiKey}"
request["Accept"] = "application/json"

response = http.request(request)
puts response.read_body`
        },
                {
            label: 'Go',
            code: `package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "${baseUrl}/certificates"
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  req.Header.Add("TRUSTLAB_API_KEY", "${apiKey}")
  req.Header.Add("Accept", "application/json")

  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}`
        }
    ];

    const tabs = snippets.map(s => ({
        label: s.label,
        content: <CodeBlock code={s.code} />
    }));

    return (
        <div className="mt-8 border dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-dark-2">
            <h2 className="text-xl font-bold mb-4 text-dark dark:text-white">API Usage Documentation</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
                You can use your API key to authenticate requests to the TrustLab API. 
                Include the key in the <code>TRUSTLAB_API_KEY</code> header.
            </p>
            <Tabs tabs={tabs} />
        </div>
    );
}
