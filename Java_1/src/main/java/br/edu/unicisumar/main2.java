package br.edu.unicisumar;
import java.util.Scanner;

public class main2 {
    public void exe2 () {
        Scanner lei = new Scanner(System.in);
        int f = 0;
        for (int i = 0; i < 2; i++) {
            System.out.printf("Digite um numero ");
            int nun1 = lei.nextInt();
            f += nun1;
        }
        System.out.printf("\n %d \n", f);
    }
}
