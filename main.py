# sources:
#   https://en.wikipedia.org/wiki/Genetic_algorithm
#   https://machinelearningmastery.com/simple-genetic-algorithm-from-scratch-in-python/
from numpy.random import randint
from numpy.random import rand


def print_sol(sol):
    print("Solution: {}".format(str(sol)))


def chessboard(n):
    for i in range(len(n)):
        for j in range(len(n)):
            if i == (n[j] - 1):
                print(" Q ", end="")
            else:
                print(" . ", end="")
        print("\n")


# the objective is having the biggest value possible
def count_attacking_pairs_of_queens(queen_list):
    nq = len(queen_list)
    max_fitness = (nq*(nq-1))/2

    horizontal_collisions = sum([queen_list.count(queen)-1 for queen in queen_list])/2

    diagonal_collisions = 0
    for x in range(len(queen_list)):
        for y in range(len(queen_list)):
            if (x == y): break # avoid self count
            if (queen_list[x] - y == queen_list[y] - x):
                diagonal_collisions += 1
            if (queen_list[x] + y == queen_list[y] + x):
                diagonal_collisions += 1

    return max_fitness - (horizontal_collisions + diagonal_collisions)


# pick 2 random parent and keep the best one
def selection(pop, scores, k=3):
    selection_ix = randint(len(pop))
    for ix in randint(0, len(pop), k - 1):
        if scores[ix] < scores[selection_ix]:
            selection_ix = ix
    return pop[selection_ix]


# mix 2 parent to make a child
def crossover(p1, p2, r_cross):
    c1, c2 = p1.copy(), p2.copy()
    if rand() < r_cross:
        pt = randint(1, len(p1) - 2)
        c1 = p1[:pt] + p2[pt:]
        c2 = p2[:pt] + p1[pt:]
    return [c1, c2]


# shift some bits randomly accross the bitstring
def mutation(bitstring, r_mut):
    for i in range(len(bitstring)):
        if rand() < r_mut:
            bitstring[i] = 1 - bitstring[i]


def genetic_algorithm(objective, n_queens, n_iter, n_pop, r_cross, r_mut):
    # generate the a random starting population
    pop = [randint(0, n_queens + 1, n_queens).tolist() for _ in range(n_pop)]

    best, best_eval = 0, objective(pop[0])

    for gen in range(n_iter):
        scores = [objective(c) for c in pop]  # score of each bitstring
        # keep track of current best score
        for i in range(n_pop):
            if scores[i] < best_eval:
                best, best_eval = pop[i], scores[i]
                print(">%d, new best f(%s) = %.3f" % (gen, pop[i], scores[i]))

        # we select the best bitstrings in a tournament like selection
        selected = [selection(pop, scores) for _ in range(n_pop)]

        # generate new children
        children = list()
        for i in range(0, n_pop, 2):
            p1, p2 = selected[i], selected[i + 1]
            for c in crossover(p1, p2, r_cross):  # we mix the 2 parents
                mutation(c, r_mut)  # we create mutation among the child
                children.append(c)
        pop = children  # we replace the population with the new children
    return [best, best_eval]

# params
n_iter = 100  # number of iteration
n_bits = 20  # number of bits inside the bitstrings
n_pop = 100  # population size
r_cross = 0.9  # probability of crossover
r_mut = 1.0 / float(n_bits)  # probability of mutation
n_queens = 4  # number of queens

best, score = genetic_algorithm(count_attacking_pairs_of_queens, n_queens, n_iter, n_pop, r_cross, r_mut)
print('Done!')
print('f(%s) = %f' % (best, score))


def main():
    print("Hello World!")


if __name__ == "__main__":
    main()
