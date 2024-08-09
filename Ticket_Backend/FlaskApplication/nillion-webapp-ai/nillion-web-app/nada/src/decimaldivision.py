from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    num_1 = SecretInteger(Input(name="num_1", party=party_alice))
    num_2 = SecretInteger(Input(name="num_2", party=party_alice))
    sum = num_1 / num_2
    return [Output(sum, "sum", party_alice)]