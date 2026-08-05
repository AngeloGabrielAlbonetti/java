package br.edu.unicisumar;
import java.util.Scanner;

public class main3 {
    public void exe3() {
        Scanner lei = new Scanner(System.in);

        System.out.println("digite um numero: ");
        float nun = lei.nextFloat();


        if ( nun % 2 == 0){
            System.out.println("par\n");
        }else{
            System.out.println("impar\n");
        }
    }
}
