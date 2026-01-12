$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot'
$env:PATH="$env:JAVA_HOME\bin;C:\besu\bin;$env:PATH"
Set-Location 'C:\Users\bisha\OneDrive\Documents\crypto'
besu --data-path nodes/node2 --genesis-file nodes/genesis.json --network-id 13371 --p2p-port 30304 --rpc-http-enabled --rpc-http-host 127.0.0.1 --rpc-http-port 8547 --rpc-http-api ETH,NET,WEB3,ADMIN,IBFT --host-allowlist "localhost,127.0.0.1" --p2p-host 127.0.0.1 --node-private-key-file nodes/node2/key --engine-rpc-port 9552 --engine-jwt-disabled
