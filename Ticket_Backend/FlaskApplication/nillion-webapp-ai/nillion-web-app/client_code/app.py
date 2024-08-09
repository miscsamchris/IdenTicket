
from flask import Flask, request, jsonify, Response
import asyncio
import json
import py_nillion_client as nillion
import os
import pytest
import time

from py_nillion_client import NodeKey, UserKey
from dotenv import load_dotenv
from cosmpy.aerial.client import LedgerClient
from cosmpy.aerial.wallet import LocalWallet
from cosmpy.crypto.keypairs import PrivateKey

from nillion_python_helpers import get_quote_and_pay, create_nillion_client, create_payments_config

import nada_numpy as na
import nada_numpy.client as na_client
import numpy as np
import pandas as pd
import torch
from nada_ai.client import TorchClient
import torch.optim as optim
import torch.nn.functional as F
from common.utils import compute, store_program, store_secret
from flask_cors import CORS, cross_origin
home = os.getenv("HOME")
load_dotenv(f"{home}/.config/nillion/nillion-devnet.env")
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
from config import CONFIG_PARTY_SYSTEM
from aptos_sdk.account import Account
from aptos_sdk.account_address import AccountAddress
from aptos_sdk.aptos_token_client import (
    AptosTokenClient,
    Collection,
    Object,
    PropertyMap,
    Property,
    ReadObject,
    Token,
)
from aptos_sdk.async_client import FaucetClient, RestClient
import os
import os.path

APTOS_CORE_PATH = os.getenv(
    "APTOS_CORE_PATH",
    os.path.abspath("./aptos-core"),
)
# :!:>section_1
FAUCET_URL = os.getenv(
    "APTOS_FAUCET_URL",
    "https://faucet.devnet.aptoslabs.com",
)
INDEXER_URL = os.getenv(
    "APTOS_INDEXER_URL",
    "https://api.devnet.aptoslabs.com/v1/graphql",
)
NODE_URL = os.getenv("APTOS_NODE_URL", "https://api.devnet.aptoslabs.com/v1")

def get_owner(obj: ReadObject) -> AccountAddress:
    return obj.resources[Object].owner


# :!:>section_6
async def get_collection_data(
    token_client: AptosTokenClient, collection_addr: AccountAddress
) -> dict[str, str]:
    collection = (await token_client.read_object(collection_addr)).resources[Collection]
    return {
        "creator": str(collection.creator),
        "name": str(collection.name),
        "description": str(collection.description),
        "uri": str(collection.uri),
    }  # <:!:section_6


# :!:>get_token_data
async def get_token_data(
    token_client: AptosTokenClient, token_addr: AccountAddress
) -> dict[str, str]:
    token = (await token_client.read_object(token_addr)).resources[Token]
    return {
        "collection": str(token.collection),
        "description": str(token.description),
        "name": str(token.name),
        "uri": str(token.uri),
        "index": str(token.index),
    }  # <:!:get_token_data

seed = "User"
client_user = create_nillion_client(
    UserKey.from_seed(seed),
    NodeKey.from_seed(seed),
)
party_seed="System_seed"
client_n = create_nillion_client(
    UserKey.from_seed(party_seed),
    NodeKey.from_seed(party_seed),
)
mlseed = "my_seed"
userkey = UserKey.from_seed((mlseed))
nodekey = NodeKey.from_seed((mlseed))
client = create_nillion_client(userkey, nodekey)
@app.route('/create_program', methods = ["POST"])
async def create_program():
    data = request.json
    print(data)
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    grpc_endpoint = os.getenv("NILLION_NILCHAIN_GRPC")
    chain_id = os.getenv("NILLION_NILCHAIN_CHAIN_ID")
    program_name = "generateotp"

    program_mir_path = f"../nada/target/{program_name}.nada.bin"
    print(program_mir_path)
    payments_config = create_payments_config(chain_id, grpc_endpoint)
    payments_client = LedgerClient(payments_config)
    payments_wallet = LocalWallet(
        PrivateKey(bytes.fromhex(os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0"))),
        prefix="nillion",
    )

    # Pay to store the program
    receipt_store_program = await get_quote_and_pay(
        client_user,
        nillion.Operation.store_program(program_mir_path),
        payments_wallet,
        payments_client,
        cluster_id,
    )

    print(f"Storing program in the network: {program_name}")
    program_id = await client_user.store_program(
        cluster_id, program_name, program_mir_path, receipt_store_program
    )

    permissions = nillion.Permissions.default_for_user(client_user.user_id)
    permissions.add_compute_permissions({client_user.user_id: {program_id}})

    user_id = client_user.user_id
    program_id = f"{user_id}/{program_name}"

    json1 = {"user_id": user_id, "program_id":program_id}

    json1 = json.dumps(json1)
    response = Response(response = json1, status=200, mimetype="application/json")
    response.headers['Content-Type']='application/json'
    response.headers['Access-Control-Allow-Origin']='*'
    return response

@app.route('/store_secrets', methods = ["POST"])
async def store_secrets(args=None):
    data = request.json
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    grpc_endpoint = os.getenv("NILLION_NILCHAIN_GRPC")
    chain_id = os.getenv("NILLION_NILCHAIN_CHAIN_ID")
    store_ids = []
    party_ids = []
    party_info=CONFIG_PARTY_SYSTEM
    party_seed = data.get('seed') + "_seed"

    party_id_n = client_n.party_id
    user_id_n = client_n.user_id

    payments_config_n = create_payments_config(chain_id, grpc_endpoint)
    payments_client_n = LedgerClient(payments_config_n)
    payments_wallet_n = LocalWallet(
        PrivateKey(bytes.fromhex(os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0"))),
        prefix="nillion",
    )

    party_name = data.get('seed')
    ticket_code=data.get('ticket_code')
    timestamp=int(time.time())
    print(timestamp)
    power1=8
    power2=10
    # Create a secret for the current party
    stored_secret = nillion.NadaValues(
        {
         "ticket_code":nillion.SecretInteger(ticket_code),
        "timestamp":nillion.SecretInteger(timestamp),
        "power1":nillion.Integer(power1),
        "power2":nillion.Integer(power2)
         }
    )

    permissions = nillion.Permissions.default_for_user(user_id_n)

    compute_permissions = {
        data.get('user_id'): {data.get('program_id')},
    }
    permissions.add_compute_permissions(compute_permissions)

    receipt_store = await get_quote_and_pay(
        client_n,
        nillion.Operation.store_values(stored_secret, ttl_days=5),
        payments_wallet_n,
        payments_client_n,
        cluster_id,
    )
    # Store the permissioned secret
    store_id = await client_n.store_values(
        cluster_id, stored_secret, permissions, receipt_store
    )

    store_ids.append(store_id)
    party_ids.append(party_id_n)


    party_ids_to_store_ids = " ".join(
        [f"{party_id}:{store_id}" for party_id, store_id in zip(party_ids, store_ids)]
    )


    json1 = {"program_id": data.get('program_id'), "party_ids_to_store_ids": party_ids_to_store_ids}
    
    json1 = json.dumps(json1)
    response = Response(response = json1, status=200, mimetype="application/json")
    
    response.headers['Content-Type']='application/json'
    response.headers['Access-Control-Allow-Origin']='*'

    return response


@app.route('/validate_otp', methods = ["POST"])
async def validate_otp(args=None):
    data = request.json
    program_id = data.get('program_id')
    party_ids_to_store_ids = data.get('party_ids_to_store_ids')

    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    grpc_endpoint = os.getenv("NILLION_NILCHAIN_GRPC")
    chain_id = os.getenv("NILLION_NILCHAIN_CHAIN_ID")
    party_id = client_user.party_id

    payments_config = create_payments_config(chain_id, grpc_endpoint)
    payments_client = LedgerClient(payments_config)
    payments_wallet = LocalWallet(
        PrivateKey(bytes.fromhex(os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0"))),
        prefix="nillion",
    )

    compute_bindings = nillion.ProgramBindings(program_id)

    compute_bindings.add_input_party("TheUser", party_id)

    compute_bindings.add_output_party("TheUser", party_id)

    pair=party_ids_to_store_ids
    party_id, store_id = pair.split(":")
    party_ids_to_store_ids = {}
    party_name = CONFIG_PARTY_SYSTEM["party_name"]
    compute_bindings.add_input_party(party_name, party_id)
    party_ids_to_store_ids[party_id] = store_id

    secret_name_alice = "otp"
    secret_value_alice = int(data.get('otp'))
    compute_time_secrets = nillion.NadaValues(
        {secret_name_alice: nillion.SecretInteger(secret_value_alice)}
    )

    # Pay for the compute
    receipt_compute = await get_quote_and_pay(
        client_user,
        nillion.Operation.compute(program_id, compute_time_secrets),
        payments_wallet,
        payments_client,
        cluster_id,
    )


    compute_id = await client_user.compute(
        cluster_id,
        compute_bindings,
        list(party_ids_to_store_ids.values()), 
        compute_time_secrets, 
        receipt_compute,
    )

    print(f"The computation was sent to the network. compute_id: {compute_id}")
    while True:
        compute_event = await client_user.next_compute_event()
        if isinstance(compute_event, nillion.ComputeFinishedEvent):
            print(f"compute_id {compute_event.uuid}")
            print(f"result is {compute_event.result.value}")
            break
    datum={"otp":"{:06d}".format(compute_event.result.value["otp"]),"isvalid":compute_event.result.value["isvalid"]}
    json1 = {"data": datum}
    
    json1 = json.dumps(json1)
    response = Response(response = json1, status=200, mimetype="application/json")
    
    response.headers['Content-Type']='application/json'
    response.headers['Access-Control-Allow-Origin']='*'
    return response
@app.route('/predict_eta', methods = ["POST"])
async def predict_eta():
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    grpc_endpoint = os.getenv("NILLION_NILCHAIN_GRPC")
    chain_id = os.getenv("NILLION_NILCHAIN_CHAIN_ID")

    party_id = client.party_id
    user_id = client.user_id

    data = request.json
    party_names = na_client.parties(2)
    program_name = "neural_net"
    program_mir_path = f"../nada/target/{program_name}.nada.bin"
    # Configure payments
    payments_config = create_payments_config(chain_id, grpc_endpoint)
    payments_client = LedgerClient(payments_config)
    payments_wallet = LocalWallet(
        PrivateKey(bytes.fromhex(os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0"))),
        prefix="nillion",
    )

    # Store program
    program_id = await store_program(
        client,
        payments_wallet,
        payments_client,
        user_id,
        cluster_id,
        program_name,
        program_mir_path,
    )

    # Create custom torch Module
    class MyNN(torch.nn.Module):
        """My simple neural net"""

        def __init__(self) -> None:
            """Model is a two layers and an activations"""
            super().__init__()
            self.linear_0 = torch.nn.Linear(3, 8)
            self.linear_1 = torch.nn.Linear(8, 1)
            self.relu = torch.nn.ReLU()

        def forward(self, x: torch.tensor) -> torch.tensor:
            """My forward pass logic"""
            x = self.linear_0(x)
            x = self.relu(x)
            x = self.linear_1(x)
            return x
    # Define a loss function
    criterion = torch.nn.MSELoss()
    my_nn = MyNN()
    my_data=pd.read_csv("test_data.csv")
    if os.path.exists("my_model"):
        my_nn.load_state_dict(torch.load("my_model"))
    else:
        # Define an optimizer
        print(my_data.head())
        optimizer = optim.SGD(my_nn.parameters(), lr=0.01)
        # X = torch.randn(100, 3)  # 100 samples, 10 features each
        # y = torch.randn(100, 1)   # 100 target values
        X=torch.tensor(my_data.drop('output', axis = 1).values.astype(np.float32)) 
        y=torch.tensor(my_data['output'].values.astype(np.float32))
        # Create DataLoader for batching
        dataset = torch.utils.data.TensorDataset(X, y)
        dataloader = torch.utils.data.DataLoader(dataset, batch_size=250, shuffle=True)
        num_epochs = 100

        for epoch in range(num_epochs):
            for batch_X, batch_y in dataloader:
                # Zero the parameter gradients
                optimizer.zero_grad()
                
                # Forward pass
                outputs = my_nn(batch_X)
                loss = criterion(outputs, batch_y)
                
                # Backward pass and optimization
                loss.backward()
                optimizer.step()
            
            if (epoch+1) % 10 == 0:
                print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')
        print("Model state is:", my_nn.state_dict())
        torch.save(my_nn.state_dict(), "my_model")

    # Create and store model secrets via ModelClient
    model_client = TorchClient(my_nn)
    model_secrets = nillion.NadaValues(
        model_client.export_state_as_secrets("my_nn", na.SecretRational)
    )
    permissions = nillion.Permissions.default_for_user(client.user_id)
    permissions.add_compute_permissions({client.user_id: {program_id}})

    model_store_id = await store_secret(
        client,
        payments_wallet,
        payments_client,
        cluster_id,
        model_secrets,
        1,
        permissions,
    )

    # Store inputs to perform inference for
    np_array=np.array([data.get("from"),data.get("to"),data.get("day_of_the_week")])
    my_input = na_client.array(np_array, "my_input", na.SecretRational)
    input_secrets = nillion.NadaValues(my_input)

    data_store_id = await store_secret(
        client,
        payments_wallet,
        payments_client,
        cluster_id,
        input_secrets,
        1,
        permissions,
    )

    # Set up the compute bindings for the parties
    compute_bindings = nillion.ProgramBindings(program_id)

    for party_name in party_names:
        compute_bindings.add_input_party(party_name, party_id)
    compute_bindings.add_output_party(party_names[-1], party_id)

    print(f"Computing using program {program_id}")
    print(f"Use secret store_id: {model_store_id} {data_store_id}")

    # Create a computation time secret to use
    computation_time_secrets = nillion.NadaValues({})

    # Compute, passing all params including the receipt that shows proof of payment
    result = await compute(
        client,
        payments_wallet,
        payments_client,
        program_id,
        cluster_id,
        compute_bindings,
        [model_store_id, data_store_id],
        computation_time_secrets,
        verbose=True,
    )

    # Sort & rescale the obtained results by the quantization scale
    outputs = [
        na_client.float_from_rational(result[1])
        for result in sorted(
            result.items(),
            key=lambda x: int(x[0].replace("my_output", "").replace("_", "")),
        )
    ]
    time_eta=outputs[-1]
    json1 = {"data": f"It will take {int(time_eta)}  minutes to reach your destination."}
    
    json1 = json.dumps(json1)
    response = Response(response = json1, status=200, mimetype="application/json")
    
    response.headers['Content-Type']='application/json'
    response.headers['Access-Control-Allow-Origin']='*'
    return response

@app.route('/mint_identicket', methods = ["POST"])
async def mint_identicket():
# :!:>section_1a
    rest_client = RestClient(NODE_URL)
    faucet_client = FaucetClient(FAUCET_URL, rest_client)  # <:!:section_1a
    data = request.json
    to_address=data.get("aptos_address")
    ticket_id=data.get("ticket_id")
    # Create client for working with the token module.
    # :!:>section_1b
    token_client = AptosTokenClient(rest_client)  # <:!:section_1b

    # :!:>section_2
    alice = Account.generate()
    bob = Account.generate()  # <:!:section_2

    collection_name = "IdenTickets Collection"
    token_name = "IdenTicket"

    # :!:>owners
    owners = {str(alice.address()): "Alice", str(bob.address()): "Bob"}  # <:!:owners
    print("\n=== Addresses ===")
    print(f"Alice: {alice.address()}")
    print(f"Bob: {bob.address()}")
    # to_address=str(bob.address())
    # :!:>section_3
    bob_fund = faucet_client.fund_account(alice.address(), 100_000_000)
    alice_fund = faucet_client.fund_account(bob.address(), 100_000_000)  # <:!:section_3
    await asyncio.gather(*[bob_fund, alice_fund])

    print("\n=== Initial Coin Balances ===")
    alice_balance = rest_client.account_balance(alice.address())
    bob_balance = rest_client.account_balance(bob.address())
    [alice_balance, bob_balance] = await asyncio.gather(*[alice_balance, bob_balance])
    print(f"Alice: {alice_balance}")
    print(f"Bob: {bob_balance}")

    print("\n=== Creating Collection and Token ===")
    # :!:>section_4
    txn_hash = await token_client.create_collection(
        alice,
        "IdenTickets Collection",
        1,
        collection_name,
        "https://ticket-hh.vercel.app",
        True,
        True,
        True,
        True,
        True,
        True,
        True,
        True,
        True,
        0,
        1,
    )  # <:!:section_4
    await rest_client.wait_for_transaction(txn_hash)
    resp = await rest_client.account_resource(alice.address(), "0x1::account::Account")
    print(int(resp["data"]["guid_creation_num"]))

    collection_addr = AccountAddress.for_named_collection(
        alice.address(), collection_name
    )
    # :!:>section_5
    txn_hash = await token_client.mint_soul_bound_token(
        alice,
        collection_name,
        "IdenTicket",
        token_name,
        "https://i.imgur.com/mWMgOiF.jpeg",
        PropertyMap([Property.string("Ticket Id",str(ticket_id))]),
        AccountAddress.from_str(to_address)
    )  # <:!:section_5
    await rest_client.wait_for_transaction(txn_hash)
    print(txn_hash)

    minted_tokens = await token_client.tokens_minted_from_transaction(txn_hash)
    print(minted_tokens)
    collection_data = await get_collection_data(token_client, collection_addr)

    await rest_client.close()

    json1 = {"status": f"NFT Minted","collection_address":str(collection_addr)}
    
    json1 = json.dumps(json1)
    response = Response(response = json1, status=200, mimetype="application/json")
    
    response.headers['Content-Type']='application/json'
    response.headers['Access-Control-Allow-Origin']='*'
    return response

if __name__ == '__main__':
    app.run(debug=False)