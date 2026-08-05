package br.edu.unicisumar;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner lei = new Scanner(System.in);
        String t = "";
        int v = 0;
        do {
            System.out.printf("digite de qual exercicios vc quer  5 e pra sair");
             v = lei.nextInt();

            switch (v){
                case 1:
                    main1 ex = new main1();
                    ex.exe1();
                    break;

                case 2:
                    main2 ex2 = new main2();
                    ex2.exe2();
                    break;


                case 3:
                    main3 ex3 = new main3();
                    ex3.exe3();
                    break;


                case 4:
                    main4 ex4 = new main4();
                    ex4.exe4();
                    break;
            }
            if (v != 5){
                System.out.println("deseja continuar (s/n): ");
                t = lei.next();
            }

        }while (v != 5 && !t.equalsIgnoreCase("n"));

        lei.close();
    }
}


