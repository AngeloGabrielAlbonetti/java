package br.edu.unicisumar;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        System.out.println("ovo");
        Scanner Lei = new Scanner(System.in);


        System.out.println("digite algo");
        int Numero = Lei.nextInt();

        if (Numero > 0){
            System.out.println("positivo");
        } else if (Numero == 0) {
            System.out.println("neutro");
        } else{
            System.out.println("negativo");
        }

        for (int i = 0; i < 10; i++) {
            System.out.printf("\nIndex : %d", i);
        }

        Lei.close();

    }

}


